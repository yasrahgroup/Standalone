import { test, expect } from '@playwright/test';

test('capability cards align icon, category, and title consistently', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/portfolio');

  const section = page.locator('#capabilities');
  await section.scrollIntoViewIfNeeded();

  const cards = section.locator('.portfolio-cap-card');
  await expect(cards).toHaveCount(4);

  const titles = await cards.locator('h3').evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return { x: Math.round(box.x), y: Math.round(box.y) };
    }),
  );

  expect(Math.abs(titles[0].x - titles[2].x)).toBeLessThanOrEqual(1);
  expect(Math.abs(titles[1].x - titles[3].x)).toBeLessThanOrEqual(1);
  expect(Math.abs(titles[0].y - titles[1].y)).toBeLessThanOrEqual(1);
  expect(Math.abs(titles[2].y - titles[3].y)).toBeLessThanOrEqual(1);

  await page.screenshot({
    path: 'C:/Users/FAIZUR~1/AppData/Local/Temp/opencode/portfolio-cap-alignment.png',
    fullPage: false,
  });
});
