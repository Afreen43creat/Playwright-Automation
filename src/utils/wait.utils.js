async function waitForPageReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

async function waitForVisible(locator, timeout = 10000) {
  await locator.waitFor({ state: 'visible', timeout });
}

async function waitForUrlContains(page, path, timeout = 10000) {
  await page.waitForURL(url => url.toString().includes(path), { timeout });
}

module.exports = {
  waitForPageReady,
  waitForVisible,
  waitForUrlContains
};
