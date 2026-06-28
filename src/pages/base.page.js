const { expect } = require('@playwright/test');
const { waitForPageReady } = require('../utils/wait.utils');
const logger = require('../utils/logger');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    logger.info(`Navigating to ${path}`);
    await this.page.goto(path);
    await waitForPageReady(this.page);
  }

  async click(locator, description = 'element') {
    logger.info(`Clicking ${description}`);
    await locator.click();
  }

  async fill(locator, value, description = 'field') {
    logger.info(`Filling ${description}`);
    await locator.fill(value);
  }

  async getText(locator) {
    await expect(locator).toBeVisible();
    return locator.textContent();
  }

  async assertPageTitle(expectedTitle) {
    await expect(this.page).toHaveTitle(expectedTitle);
  }
}

module.exports = { BasePage };
