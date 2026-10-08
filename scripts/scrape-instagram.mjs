import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function scrapeInstagram() {
  console.log('Launching browser to check Instagram profile...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'es-ES'
  });
  const page = await context.newPage();

  try {
    await page.goto('https://www.instagram.com/domus.voleibol.club/?hl=es', { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  await page.waitForTimeout(3000);

  const title = await page.title();
  console.log('Title:', title);

  // Take screenshot of Instagram page
  await page.screenshot({ path: 'public/screenshots/instagram-page.png', fullPage: true });

  // Extract meta tags and profile data
  const metaDescription = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const bodyText = document.body.innerText;
    
    // Find all images on the page
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    }));

    // Find links
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      href: a.href,
      text: a.innerText
    }));

    return {
      meta: meta ? meta.content : null,
      ogDesc: ogDesc ? ogDesc.content : null,
      ogTitle: ogTitle ? ogTitle.content : null,
      ogImage: ogImage ? ogImage.content : null,
      bodyTextSnippet: bodyText.slice(0, 3000),
      images,
      links
    };
  });

  console.log('Extracted meta info:', JSON.stringify({
    title,
    ogTitle: metaDescription.ogTitle,
    ogDesc: metaDescription.ogDesc,
    meta: metaDescription.meta,
    ogImage: metaDescription.ogImage
  }, null, 2));

  console.log('Found images count:', metaDescription.images.length);
  fs.writeFileSync('scripts/instagram-data.json', JSON.stringify(metaDescription, null, 2));

  await browser.close();
}

scrapeInstagram().catch(err => {
  console.error('Error running scrape:', err);
  process.exit(1);
});
