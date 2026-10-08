import { chromium } from 'playwright';
import fs from 'fs';

async function runVisualAudit() {
  console.log('🚀 Iniciando auditoría visual con Playwright & Chrome DevTools...');
  fs.mkdirSync('public/screenshots', { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // Track console errors and warnings
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    consoleMessages.push(`[Page Error] ${error.message}`);
  });

  // 1. Navigate to landing page
  console.log('📍 Navegando a http://localhost:4321...');
  await page.goto('http://localhost:4321', { waitUntil: 'networkidle' });

  // 2. Scroll through all sections so GSAP ScrollTriggers fire and render all cards
  console.log('📜 Desplazando sección por sección para activar ScrollTriggers...');
  const sections = ['#fundamentos', '#nosotros', '#categorias', '#metodologia', '#horarios', '#galeria', '#faq'];
  for (const sel of sections) {
    const el = await page.locator(sel);
    if (await el.count() > 0) {
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
    }
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  // 3. Capture Desktop Full Page Screenshot
  console.log('📸 Capturando pantalla completa Desktop con todos los elementos activados...');
  await page.screenshot({ path: 'public/screenshots/desktop-landing.png', fullPage: true });

  // 4. Test Modal Interaction
  console.log('🧪 Probando interacción con Modal de Inscripción...');
  const modalBtn = await page.locator('[data-open-modal]').first();
  await modalBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/screenshots/modal-open.png' });

  // Close modal
  const closeBtn = await page.locator('.close-modal-btn').first();
  await closeBtn.click();
  await page.waitForTimeout(400);

  // 5. Test Lightbox Interaction
  console.log('🧪 Probando interacción con Galería Lightbox...');
  const galleryPhoto = await page.locator('[data-gallery-photo]').first();
  await galleryPhoto.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'public/screenshots/lightbox-open.png' });

  // Close lightbox
  const lightboxClose = await page.locator('#lightbox-close');
  await lightboxClose.click();
  await page.waitForTimeout(400);

  // 6. Test Mobile Viewport (iPhone 14)
  console.log('📱 Probando vista móvil responsive (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'public/screenshots/mobile-landing.png', fullPage: true });

  // Test Mobile Menu Toggle
  const mobileMenuBtn = await page.locator('#mobile-menu-btn');
  if (await mobileMenuBtn.isVisible()) {
    await mobileMenuBtn.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'public/screenshots/mobile-menu-open.png' });
  }

  // Check UI health
  console.log('\n--- RESULTADOS AUDITORÍA ---');
  console.log(`Errores en consola de navegador: ${consoleMessages.length}`);
  if (consoleMessages.length > 0) {
    console.error(consoleMessages.join('\n'));
  } else {
    console.log('✅ Cero errores en consola de JavaScript.');
  }

  // Check critical elements existence
  const checks = [
    { name: 'Video de fondo', selector: '#hero-bg-video' },
    { name: 'Escudo oficial del club', selector: 'img[alt*="Domus"]' },
    { name: 'Sección Fundamentos', selector: '#fundamentos' },
    { name: 'Pizarra táctica', selector: '.grid-cols-3' },
    { name: 'Botón flotante WhatsApp', selector: 'aside[aria-label*="WhatsApp"]' },
    { name: 'Marquee Deportivo', selector: '.animate-marquee' },
    { name: 'Sección Horarios', selector: '#horarios' }
  ];

  for (const check of checks) {
    const el = await page.locator(check.selector).first();
    const count = await el.count();
    console.log(`${count > 0 ? '✅' : '❌'} ${check.name}: ${count > 0 ? 'Presente y renderizado' : 'No encontrado'}`);
  }

  await browser.close();
  console.log('\n🎉 Auditoría visual completada con éxito.');
}

runVisualAudit().catch(err => {
  console.error('Error durante auditoría Playwright:', err);
  process.exit(1);
});
