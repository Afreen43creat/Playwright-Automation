const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart_item, [data-testid="cart-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"], [data-testid="checkout-button"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"], [data-testid="continue-shopping"]');
  }

  async expectItemInCart(productName) {
    await expect(this.cartItems.filter({ hasText: productName }).first()).toBeVisible();
  }

  async removeItem(productName) {
    const item = this.cartItems.filter({ hasText: productName }).first();
    await item.locator('button:has-text("Remove"), [data-testid="remove-cart-item"]').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getCartItemPrice(productName) {
    const item = this.cartItems.filter({ hasText: productName }).first();
    const priceText = await item.locator('.inventory_item_price, [data-testid="cart-item-price"]').textContent();
    return Number(priceText.replace(/[^0-9.]/g, ''));
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }
}

module.exports = { CartPage };
