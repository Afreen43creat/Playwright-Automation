const { expect } = require('@playwright/test');

async function expectPriceToEqual(actualText, expectedAmount) {
  const actualAmount = Number(actualText.replace(/[^0-9.]/g, ''));
  expect(actualAmount).toBeCloseTo(expectedAmount, 2);
}

async function expectVisibleWithText(locator, expectedText) {
  await expect(locator).toBeVisible();
  await expect(locator).toContainText(expectedText);
}

async function expectApiOk(response) {
  expect(response.ok(), `Expected API status to be OK, got ${response.status()}`).toBeTruthy();
}

module.exports = {
  expectPriceToEqual,
  expectVisibleWithText,
  expectApiOk
};
