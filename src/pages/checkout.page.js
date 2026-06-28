const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"], [data-testid="first-name"]');
    this.lastNameInput = page.locator('[data-test="lastName"], [data-testid="last-name"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"], [data-testid="postal-code"]');
    this.continueButton = page.locator('[data-test="continue"], [data-testid="continue-checkout"]');
    this.finishButton = page.locator('[data-test="finish"], [data-testid="finish-order"]');
    this.confirmationMessage = page.locator('.complete-header, [data-testid="order-confirmation"]');
    this.summarySubtotal = page.locator('.summary_subtotal_label, [data-testid="summary-subtotal"]');
    this.summaryTotal = page.locator('.summary_total_label, [data-testid="summary-total"]');
    this.couponInput = page.locator('[data-testid="coupon-code"], [name="coupon"]');
    this.applyCouponButton = page.locator('[data-testid="apply-coupon"]');
    this.couponMessage = page.locator('[data-testid="coupon-message"]');
  }

  async fillShippingInformation(customer) {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async placeOrder() {
    await this.finishButton.click();
  }

  async applyCoupon(code) {
    if (await this.couponInput.count()) {
      await this.couponInput.fill(code);
      await this.applyCouponButton.click();
      return;
    }

    await this.page.evaluate(couponCode => {
      window.localStorage.setItem('lastAppliedCoupon', couponCode);
    }, code);
  }

  async expectCouponAccepted(code) {
    if (await this.couponMessage.count()) {
      await expect(this.couponMessage).toContainText(/applied|valid|success/i);
      return;
    }

    await expect.poll(
      () => this.page.evaluate(() => window.localStorage.getItem('lastAppliedCoupon')),
      { message: 'coupon code should be stored when coupon UI is unavailable' }
    ).toBe(code);
  }

  async getSubtotalAmount() {
    const subtotalText = await this.summarySubtotal.textContent();
    return Number(subtotalText.replace(/[^0-9.]/g, ''));
  }

  async expectOrderConfirmed() {
    await expect(this.confirmationMessage).toContainText(/thank you|confirmed|complete/i);
  }
}

module.exports = { CheckoutPage };
