import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import https from 'https';

const outDir = 'public/images/instagram';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download: status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function scrapeDetailsAndDownload() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'es-ES'
  });
  const page = await context.newPage();

  console.log('Navigating to Instagram profile...');
  await page.goto('https://www.instagram.com/domus.voleibol.club/?hl=es', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(2000);

  // Close modal if present
  try {
    const closeBtn = await page.$('div[role="dialog"] button:has(svg[aria-label="Cerrar"]), svg[aria-label="Cerrar"]');
    if (closeBtn) {
      await closeBtn.click();
      console.log('Closed popup dialog');
      await page.waitForTimeout(1000);
    }
  } catch (e) {
    console.log('No close button or modal dismiss error:', e.message);
  }

  // Also try clicking the backdrop or pressing Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Take screenshot of clean profile
  await page.screenshot({ path: 'public/screenshots/instagram-clean.png', fullPage: true });

  // Get all post links
  const postLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]'));
    return links.map(a => ({
      href: a.href,
      img: a.querySelector('img') ? a.querySelector('img').src : null,
      alt: a.querySelector('img') ? a.querySelector('img').alt : null
    }));
  });

  console.log(`Found ${postLinks.length} post links.`);

  // Get raw instagram-data.json images to download
  const rawData = JSON.parse(fs.readFileSync('scripts/instagram-data.json', 'utf8'));
  console.log('Downloading images from scraped data...');

  const downloaded = [];
  let index = 1;
  for (const img of rawData.images) {
    if (img.width >= 300 || img.height >= 300) {
      const ext = '.jpg';
      const filename = `ig-post-${index}${ext}`;
      const dest = path.join(outDir, filename);
      try {
        await downloadImage(img.src, dest);
        downloaded.push({
          filename,
          path: `/images/instagram/${filename}`,
          alt: img.alt,
          width: img.width,
          height: img.height
        });
        console.log(`Downloaded ${filename} (${img.width}x${img.height})`);
        index++;
      } catch (err) {
        console.error(`Error downloading ${img.src}:`, err.message);
      }
    }
  }

  // Also download the profile pic (avatar)
  const avatarImg = rawData.images.find(img => img.alt && img.alt.includes('perfil'));
  if (avatarImg) {
    const dest = path.join(outDir, 'ig-avatar.jpg');
    try {
      await downloadImage(avatarImg.src, dest);
      console.log('Downloaded ig-avatar.jpg');
    } catch (e) {
      console.error('Error downloading avatar:', e);
    }
  }

  fs.writeFileSync('scripts/downloaded-instagram-images.json', JSON.stringify(downloaded, null, 2));

  // Now, visit the top 5-6 post links to extract their captions and high-res details
  const postDetails = [];
  for (let i = 0; i < Math.min(postLinks.length, 8); i++) {
    const post = postLinks[i];
    try {
      console.log(`Visiting post ${i + 1}: ${post.href}`);
      const postPage = await context.newPage();
      await postPage.goto(post.href, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await postPage.waitForTimeout(2000);

      const details = await postPage.evaluate(() => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]')?.content;
        const ogDesc = document.querySelector('meta[property="og:description"]')?.content;
        const ogTitle = document.querySelector('meta[property="og:title"]')?.content;
        const h1 = document.querySelector('h1')?.innerText;
        // Text inside caption container
        const textElements = Array.from(document.querySelectorAll('span, p, div')).map(e => e.innerText);
        return {
          title,
          metaDesc,
          ogDesc,
          ogTitle,
          h1
        };
      });

      postDetails.push({
        url: post.href,
        details
      });
      await postPage.close();
    } catch (err) {
      console.log(`Error visiting post ${i + 1}:`, err.message);
    }
  }

  fs.writeFileSync('scripts/instagram-posts-content.json', JSON.stringify(postDetails, null, 2));
  await browser.close();
  console.log('Scraping and download completed successfully!');
}

scrapeDetailsAndDownload().catch(err => {
  console.error('Fatal scrape error:', err);
  process.exit(1);
});
