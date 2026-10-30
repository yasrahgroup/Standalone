const { chromium } = require('playwright');

const routes = [
  '/',
  '/about',
  '/values',
  '/delivery-framework',
  '/products',
  '/products/fitness-management-system',
  '/services',
  '/portfolio',
  '/technology-insights',
  '/technology-insights/modern-microservices-architecture',
  '/testimonials',
  '/connect-with-us',
  '/privacy-policy',
  '/terms-of-service',
  '/admin/login'
];

const viewports = [
  { name: 'Small mobile (320x568)', width: 320, height: 568 },
  { name: 'Mobile (360x800)', width: 360, height: 800 },
  { name: 'Standard mobile (375x812)', width: 375, height: 812 },
  { name: 'Standard mobile (390x844)', width: 390, height: 844 },
  { name: 'Large mobile (430x932)', width: 430, height: 932 },
  { name: 'Phone landscape (568x320)', width: 568, height: 320 },
  { name: 'Tablet portrait (768x1024)', width: 768, height: 1024 },
  { name: 'Tablet portrait (820x1180)', width: 820, height: 1180 },
  { name: 'Tablet landscape (1024x768)', width: 1024, height: 768 },
  { name: 'Tablet portrait / Desktop Site (1024x1366)', width: 1024, height: 1366 },
  { name: 'Small desktop (1280x720)', width: 1280, height: 720 },
  { name: 'Laptop (1366x768)', width: 1366, height: 768 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
  { name: 'Large desktop (1920x1080)', width: 1920, height: 1080 },
  { name: 'Ultra-wide (2560x1080)', width: 2560, height: 1080 },
  // Phone Desktop Site mode: standard phone screen running desktop-like viewport
  { name: 'Phone Desktop Site mode (viewport 1024 on 390 screen simulation)', width: 1024, height: 844, isPhoneDesktop: true },
  { name: 'Phone Desktop Site mode 980px', width: 980, height: 844, isPhoneDesktop: true },
  { name: 'Tablet Desktop Site mode 1280px on 768', width: 1280, height: 1024, isTabletDesktop: true }
];

async function runAudit() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const issues = [];
  console.log(`Starting responsive audit across ${routes.length} routes and ${viewports.length} viewports...`);

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    for (const route of routes) {
      try {
        const url = `http://localhost:3000${route}`;
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(500); // Wait for animations / fonts

        // Check horizontal overflow
        const overflowData = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const bodyWidth = document.body.scrollWidth;
          const windowWidth = window.innerWidth;
          const hasDocOverflow = docWidth > windowWidth + 1 || bodyWidth > windowWidth + 1;

          let overflowingElements = [];
          if (hasDocOverflow) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > windowWidth + 2) {
                overflowingElements.push({
                  tagName: el.tagName,
                  id: el.id,
                  className: typeof el.className === 'string' ? el.className.slice(0, 100) : '',
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  textSnippet: (el.textContent || '').trim().slice(0, 60)
                });
                if (overflowingElements.length >= 5) break;
              }
            }
          }
          return {
            docWidth,
            bodyWidth,
            windowWidth,
            hasDocOverflow,
            overflowingElements
          };
        });

        if (overflowData.hasDocOverflow) {
          const issue = {
            viewport: vp.name,
            width: vp.width,
            route,
            docWidth: overflowData.docWidth,
            windowWidth: overflowData.windowWidth,
            diff: overflowData.docWidth - overflowData.windowWidth,
            elements: overflowData.overflowingElements
          };
          issues.push(issue);
          console.log(`[OVERFLOW] ${vp.name} on ${route}: docWidth=${overflowData.docWidth} > innerWidth=${overflowData.windowWidth} (+${issue.diff}px)`);
        }
      } catch (err) {
        console.error(`Error on ${route} at ${vp.width}x${vp.height}:`, err.message);
      }
    }
  }

  await browser.close();
  console.log(`\nAudit complete! Found ${issues.length} overflow instances.`);
  return issues;
}

runAudit().then(issues => {
  if (issues.length > 0) {
    console.log(JSON.stringify(issues, null, 2));
    process.exit(1);
  } else {
    console.log('ALL ROUTES AND VIEWPORTS PASSED WITH ZERO OVERFLOW!');
    process.exit(0);
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});
