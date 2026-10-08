import { chromium } from 'playwright';

async function runAudit() {
  console.log('🚀 Starting Playwright Visual Audit for V2 Pro with Real Instagram Assets...');
  const browser = await chromium.launch({ headless: true });

  const consoleErrors = [];
  const pageErrors = [];

  // 1. Desktop Audit
  console.log('\n📱 Testing Desktop Viewport (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const desktopPage = await desktopContext.newPage();

  desktopPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  desktopPage.on('pageerror', err => {
    pageErrors.push(`[Page Error] ${err.message}`);
  });

  await desktopPage.goto('http://localhost:4321/v2', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1000);

  // Take Hero Screenshot
  await desktopPage.screenshot({ path: 'public/screenshots/v2/desktop-hero.png' });
  console.log('✅ Captured desktop-hero.png');

  // Bento with real Instagram photos
  const bentoSection = desktopPage.locator('#experiencia');
  await bentoSection.screenshot({ path: 'public/screenshots/v2/bento-instagram-photos.png' });
  console.log('✅ Captured bento-instagram-photos.png');

  // Category Matrix with flyer
  const categorySection = desktopPage.locator('#categorias');
  await categorySection.screenshot({ path: 'public/screenshots/v2/category-flyer-schedules.png' });
  console.log('✅ Captured category-flyer-schedules.png');

  // Test Tactical Board Interaction
  console.log('Testing Tactical Board interactivity...');
  const armadorTab = desktopPage.locator('[data-pos-tab="armador"]');
  await armadorTab.click();
  await desktopPage.waitForTimeout(400);

  const hudName = await desktopPage.locator('[data-hud-name]').textContent();
  console.log(`Tactical HUD switched to: ${hudName}`);

  const tacticalCourtSection = desktopPage.locator('#tactica');
  await tacticalCourtSection.screenshot({ path: 'public/screenshots/v2/tactical-board-armador.png' });
  console.log('✅ Captured tactical-board-armador.png');

  // Test Líbero node click
  const liberoNode = desktopPage.locator('[data-position-key="libero"]');
  await liberoNode.click();
  await desktopPage.waitForTimeout(400);
  const liberoHudName = await desktopPage.locator('[data-hud-name]').textContent();
  console.log(`Tactical HUD switched to: ${liberoHudName}`);

  // Test Category Matrix Switching
  console.log('Testing Category Matrix...');
  const adultosTab = desktopPage.locator('[data-cat-tab="adultos"]');
  await adultosTab.click();
  await desktopPage.waitForTimeout(400);

  // Test Calculator Interaction
  console.log('Testing Membership Calculator...');
  const calcAdultoBtn = desktopPage.locator('[data-calc-age="adulto"]');
  await calcAdultoBtn.click();
  const calcWeekendBtn = desktopPage.locator('[data-calc-freq="weekend"]');
  await calcWeekendBtn.click();
  await desktopPage.waitForTimeout(300);

  const calcTitle = await desktopPage.locator('[data-plan-title]').textContent();
  console.log(`Calculated plan: ${calcTitle}`);

  // Gallery section screenshot
  const gallerySection = desktopPage.locator('#galeria');
  await gallerySection.screenshot({ path: 'public/screenshots/v2/gallery-real-photos.png' });
  console.log('✅ Captured gallery-real-photos.png');

  // Test Gallery Lightbox
  console.log('Testing Gallery Lightbox...');
  const firstPhoto = desktopPage.locator('[data-gallery-category]').first();
  await firstPhoto.click();
  await desktopPage.waitForTimeout(500);

  const isLightboxVisible = await desktopPage.locator('[data-v2-lightbox]').isVisible();
  console.log(`Lightbox opened: ${isLightboxVisible}`);
  await desktopPage.screenshot({ path: 'public/screenshots/v2/lightbox-open.png' });
  console.log('✅ Captured lightbox-open.png');

  // Close lightbox
  await desktopPage.keyboard.press('Escape');
  await desktopPage.waitForTimeout(300);

  // Instagram Live Feed section screenshot
  const igFeedSection = desktopPage.locator('#instagram-feed');
  await igFeedSection.screenshot({ path: 'public/screenshots/v2/instagram-live-feed.png' });
  console.log('✅ Captured instagram-live-feed.png');

  // Test Enrollment Modal
  console.log('Testing Enrollment Modal...');
  const openModalBtn = desktopPage.locator('[data-open-enroll-modal]').first();
  await openModalBtn.click();
  await desktopPage.waitForTimeout(500);

  const isModalVisible = await desktopPage.locator('[data-enroll-modal-v2]').isVisible();
  console.log(`Modal opened: ${isModalVisible}`);
  await desktopPage.screenshot({ path: 'public/screenshots/v2/modal-open.png' });
  console.log('✅ Captured modal-open.png');

  // Close modal with Escape
  await desktopPage.keyboard.press('Escape');
  await desktopPage.waitForTimeout(300);

  // Take Full Desktop Page Screenshot
  await desktopPage.screenshot({ path: 'public/screenshots/v2/desktop-fullpage.png', fullPage: true });
  console.log('✅ Captured desktop-fullpage.png');

  // 2. Mobile Audit (iPhone 14 / 390x844)
  console.log('\n📱 Testing Mobile Viewport (390x844)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  const mobilePage = await mobileContext.newPage();

  mobilePage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Mobile Console Error] ${msg.text()}`);
    }
  });

  mobilePage.on('pageerror', err => {
    pageErrors.push(`[Mobile Page Error] ${err.message}`);
  });

  await mobilePage.goto('http://localhost:4321/v2', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Test Mobile Navigation Menu
  const mobileToggle = mobilePage.locator('[data-mobile-menu-toggle-v2]');
  await mobileToggle.click();
  await mobilePage.waitForTimeout(300);
  await mobilePage.screenshot({ path: 'public/screenshots/v2/mobile-menu.png' });
  console.log('✅ Captured mobile-menu.png');

  // Close menu
  await mobileToggle.click();
  await mobilePage.waitForTimeout(300);

  // Take Full Mobile Screenshot
  await mobilePage.screenshot({ path: 'public/screenshots/v2/mobile-fullpage.png', fullPage: true });
  console.log('✅ Captured mobile-fullpage.png');

  await browser.close();

  // Audit Summary
  console.log('\n================ AUDIT SUMMARY ================');
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.error(e));
  }
  console.log(`Page Unhandled Exceptions: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    pageErrors.forEach(e => console.error(e));
  }
  console.log('===============================================');

  if (consoleErrors.length === 0 && pageErrors.length === 0) {
    console.log('🎉 AUDIT PASSED WITH 0 CONSOLE ERRORS AND 0 PAGE EXCEPTIONS!');
  } else {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
