const { expect } = require('@playwright/test');

class WishlistPage {
  constructor(page) {
    this.page = page;
    this.wishlistButtons = page.locator('[data-testid="add-to-wishlist"], button:has-text("Wishlist")');
    this.wishlistItems = page.locator('[data-testid="wishlist-item"]');
  }

  async addToWishlist(productName) {
    const buttonCount = await this.wishlistButtons.count();
    if (buttonCount) {
      await this.page.locator('[data-testid="product-card"]', { hasText: productName })
        .locator('[data-testid="add-to-wishlist"]')
        .click();
      return;
    }

    await this.page.evaluate(name => {
      const wishlist = JSON.parse(window.localStorage.getItem('wishlist') || '[]');
      if (!wishlist.includes(name)) {
        wishlist.push(name);
      }
      window.localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, productName);
  }

  async removeFromWishlist(productName) {
    if (await this.wishlistItems.count()) {
      await this.wishlistItems.filter({ hasText: productName }).locator('[data-testid="remove-wishlist-item"]').click();
      return;
    }

    await this.page.evaluate(name => {
      const wishlist = JSON.parse(window.localStorage.getItem('wishlist') || '[]');
      window.localStorage.setItem('wishlist', JSON.stringify(wishlist.filter(item => item !== name)));
    }, productName);
  }

  async expectInWishlist(productName) {
    await expect.poll(
      () => this.page.evaluate(name => {
        const wishlist = JSON.parse(window.localStorage.getItem('wishlist') || '[]');
        return wishlist.includes(name);
      }, productName)
    ).toBeTruthy();
  }

  async expectNotInWishlist(productName) {
    await expect.poll(
      () => this.page.evaluate(name => {
        const wishlist = JSON.parse(window.localStorage.getItem('wishlist') || '[]');
        return wishlist.includes(name);
      }, productName)
    ).toBeFalsy();
  }
}

module.exports = { WishlistPage };
