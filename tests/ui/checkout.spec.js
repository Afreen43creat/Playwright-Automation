const { test } = require('../../src/fixtures/test-fixtures');
const { LoginPage } = require('../../src/pages/login.page');
const { ProductsPage } = require('../../src/pages/products.page');
const { CartPage } = require('../../src/pages/cart.page');
const { CheckoutPage } = require('../../src/pages/checkout.page');

test.describe('Checkout', () => {
  async function createCheckout(page, testData) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);

    const productsPage = new ProductsPage(page);
    await productsPage.addProductToCart(testData.products.primaryProduct.name);
    await productsPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    return new CheckoutPage(page);
  }

  test('checkout process completes with order confirmation @smoke @regression', async ({ page, testData }) => {
    const checkoutPage = await createCheckout(page, testData);

    await checkoutPage.fillShippingInformation(testData.checkout.customer);
    await checkoutPage.placeOrder();

    await checkoutPage.expectOrderConfirmed();
  });

  test('coupon code validation accepts valid coupon @regression', async ({ page, testData }) => {
    const checkoutPage = await createCheckout(page, testData);

    await checkoutPage.fillShippingInformation(testData.checkout.customer);
    await checkoutPage.applyCoupon(testData.products.coupon.validCode);

    await checkoutPage.expectCouponAccepted(testData.products.coupon.validCode);
  });
});
