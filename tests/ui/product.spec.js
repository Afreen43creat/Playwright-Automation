const { test, expect } = require('../../src/fixtures/test-fixtures');
const { LoginPage } = require('../../src/pages/login.page');
const { ProductsPage } = require('../../src/pages/products.page');
const { CartPage } = require('../../src/pages/cart.page');
const { CheckoutPage } = require('../../src/pages/checkout.page');
const { WishlistPage } = require('../../src/pages/wishlist.page');

test.describe.configure({ mode: 'parallel' });

test.describe('Product experience', () => {
  async function signIn(page, testData) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    return new ProductsPage(page);
  }

  test('product search returns matching product @sanity @regression', async ({ page, testData }) => {
    const productsPage = await signIn(page, testData);

    await productsPage.searchProduct(testData.products.primaryProduct.name);
    await productsPage.expectProductVisible(testData.products.primaryProduct.name);
  });

  test('filter products by price low to high @smoke @regression', async ({ page, testData }) => {
    const productsPage = await signIn(page, testData);

    await productsPage.filterBy(testData.products.filter.priceLowToHigh);

    await productsPage.expectSortedPriceLowToHigh();
  });

  test('add and remove cart items @smoke @regression', async ({ page, testData }) => {
    const productsPage = await signIn(page, testData);

    await productsPage.addProductToCart(testData.products.primaryProduct.name);
    await productsPage.expectCartCount(1);
    await productsPage.removeProductFromCart(testData.products.primaryProduct.name);

    await productsPage.expectCartCount(0);
  });

  test('price remains consistent from product page to cart and checkout @regression', async ({ page, testData }) => {
    const productsPage = await signIn(page, testData);
    const productName = testData.products.primaryProduct.name;
    const productPrice = await productsPage.getProductPrice(productName);

    await productsPage.addProductToCart(productName);
    await productsPage.openCart();

    const cartPage = new CartPage(page);
    await cartPage.expectItemInCart(productName);
    const cartPrice = await cartPage.getCartItemPrice(productName);
    expect(cartPrice).toBe(productPrice);

    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillShippingInformation(testData.checkout.customer);

    const checkoutSubtotal = await checkoutPage.getSubtotalAmount();
    expect(checkoutSubtotal).toBe(productPrice);
  });

  test('wishlist add and remove flow @regression', async ({ page, testData }) => {
    await signIn(page, testData);
    const wishlistPage = new WishlistPage(page);
    const productName = testData.products.secondaryProduct.name;

    await wishlistPage.addToWishlist(productName);
    await wishlistPage.expectInWishlist(productName);
    await wishlistPage.removeFromWishlist(productName);

    await wishlistPage.expectNotInWishlist(productName);
  });

  test('inventory stock is available for product @sanity @regression', async ({ page, testData }) => {
    const productsPage = await signIn(page, testData);

    await productsPage.expectProductInStock(testData.products.primaryProduct.name);
  });
});
