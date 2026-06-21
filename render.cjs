const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const taskDir = __dirname;
const outputDir = path.join(taskDir, 'output');

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  const htmlPath = path.join(taskDir, 'index.html');
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });

  // Wait for WebGL and fonts
  await page.waitForTimeout(2000);

  const posters = await page.$$('.poster.xhs');
  console.log(`Found ${posters.length} posters`);

  for (let i = 0; i < posters.length; i++) {
    const id = `xhs-${String(i + 1).padStart(2, '0')}`;
    const outputPath = path.join(outputDir, `${id}.png`);
    await posters[i].screenshot({ path: outputPath, type: 'png' });
    console.log(`Saved: ${outputPath}`);
  }

  await browser.close();
  console.log('Done!');
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
