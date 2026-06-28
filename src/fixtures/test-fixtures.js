const { test: base, expect, request } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { ProductsPage } = require('../pages/products.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutPage } = require('../pages/checkout.page');
const { WishlistPage } = require('../pages/wishlist.page');
const { getEnvConfig } = require('../config/env.config');
const users = require('../test-data/users.json');
const products = require('../test-data/products.json');
const checkout = require('../test-data/checkout.json');

const test = base.extend({
  envConfig: async ({}, use) => {
    await use(getEnvConfig());
  },

  testData: async ({}, use) => {
    await use({ users, products, checkout });
  },

  apiContext: async ({ envConfig }, use) => {
    const context = await request.newContext({
      baseURL: envConfig.apiBaseURL,
      extraHTTPHeaders: {
        Accept: 'application/json'
      }
    });
    await use(context);
    await context.dispose();
  },

  ecommerceContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: { dir: 'test-results/videos' }
    });
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ ecommerceContext, testData }, use) => {
    const page = await ecommerceContext.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  wishlistPage: async ({ page }, use) => {
    await use(new WishlistPage(page));
  }
});

module.exports = { test, expect };
