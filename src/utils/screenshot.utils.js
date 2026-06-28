const path = require('path');

async function captureScreenshot(page, name) {
  const safeName = name.replace(/[^a-z0-9-_]/gi, '_').toLowerCase();
  const screenshotPath = path.join('test-results', 'screenshots', `${Date.now()}-${safeName}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

module.exports = { captureScreenshot };
