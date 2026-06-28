const { test, expect } = require('../../src/fixtures/test-fixtures');
const apiData = require('../../src/test-data/api.json');
const { expectApiOk } = require('../../src/utils/assertions');

test.describe('E-commerce API', () => {
  test('validate product API response @smoke @regression', async ({ page }) => {
    await page.route(`**${apiData.productsEndpoint}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          products: [
            { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack', price: 29.99, inStock: true },
            { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light', price: 9.99, inStock: true }
          ]
        })
      });
    });

    const response = await page.goto(apiData.productsEndpoint);
    await expectApiOk(response);
    const payload = JSON.parse(await page.locator('body').textContent());

    expect(payload.products).toHaveLength(2);
    expect(payload.products[0]).toEqual(expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      inStock: expect.any(Boolean)
    }));
  });

  test('validate order API response @regression', async ({ page }) => {
    await page.route(`**${apiData.ordersEndpoint}`, async route => {
      const requestBody = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          orderId: 'ORD-10001',
          status: 'confirmed',
          ...requestBody
        })
      });
    });

    await page.goto('/');
    const payload = await page.evaluate(async order => {
      const response = await fetch('/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(order)
      });
      return response.json();
    }, apiData.sampleOrder);

    expect(payload.status).toBe('confirmed');
    expect(payload.orderId).toMatch(/^ORD-/);
    expect(payload.productId).toBe(apiData.sampleOrder.productId);
  });

  test('mock payment API using route interception @smoke @regression', async ({ page }) => {
    await page.route(apiData.paymentEndpointPattern, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          paymentId: 'PAY-90001',
          status: 'authorized',
          gateway: 'mock'
        })
      });
    });

    await page.goto('/');
    const payment = await page.evaluate(async () => {
      const response = await fetch('/payments/authorize', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ amount: 29.99, currency: 'USD' })
      });
      return response.json();
    });

    expect(payment.status).toBe('authorized');
    expect(payment.gateway).toBe('mock');
  });
});
