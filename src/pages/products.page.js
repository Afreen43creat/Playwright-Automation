const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.inventoryItems = page.locator('.inventory_item, [data-testid="product-card"]');
    this.sortDropdown = page.locator('[data-test="product_sort_container"], [data-testid="product-sort"], select, [role="combobox"]');
    this.searchInput = page.locator('[data-testid="product-search"], [name="search"]');
    this.cartBadge = page.locator('.shopping_cart_badge, [data-testid="cart-count"]');
    this.cartLink = page.locator('.shopping_cart_link, [data-testid="cart-link"]');
    this.productTitle = page.locator('.inventory_item_name, [data-testid="product-name"]');
    this.productPrice = page.locator('.inventory_item_price, [data-testid="product-price"]');
  }

  async expectLoaded() {
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async searchProduct(term) {
    if (await this.searchInput.count()) {
      await this.searchInput.fill(term);
      return;
    }

    await expect(this.inventoryItems.filter({ hasText: term }).first()).toBeVisible();
  }

  async filterBy(optionLabel) {
    await this.sortDropdown.selectOption({ label: optionLabel });
  }

  async addProductToCart(productName) {
    const product = this.inventoryItems.filter({ hasText: productName }).first();
    await product.locator('button:has-text("Add to cart"), [data-testid="add-to-cart"]').click();
  }

  async removeProductFromCart(productName) {
    const product = this.inventoryItems.filter({ hasText: productName }).first();
    await product.locator('button:has-text("Remove"), [data-testid="remove-from-cart"]').click();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async getProductPrice(productName) {
    const product = this.inventoryItems.filter({ hasText: productName }).first();
    const priceText = await product.locator('.inventory_item_price, [data-testid="product-price"]').textContent();
    return Number(priceText.replace(/[^0-9.]/g, ''));
  }

  async expectCartCount(count) {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }

    await expect(this.cartBadge).toHaveText(String(count));
  }

  async expectSortedPriceLowToHigh() {
    const prices = await this.productPrice.allTextContents();
    const amounts = prices.map(price => Number(price.replace(/[^0-9.]/g, '')));
    const sorted = [...amounts].sort((a, b) => a - b);
    expect(amounts).toEqual(sorted);
  }

  async expectProductVisible(productName) {
    await expect(this.inventoryItems.filter({ hasText: productName }).first()).toBeVisible();
  }

  async expectProductInStock(productName) {
    const product = this.inventoryItems.filter({ hasText: productName }).first();
    await expect(product.locator('button:has-text("Add to cart"), button:has-text("Remove"), [data-testid="stock-status"]')).toBeVisible();
  }
}

module.exports = { ProductsPage };
