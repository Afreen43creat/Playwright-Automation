const { test, expect } = require('../../src/fixtures/test-fixtures');

test.describe('Authentication', () => {
  test('user can login and logout @smoke @sanity', async ({ loginPage, productsPage, testData }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.standard.username, testData.users.standard.password);
    await loginPage.expectLoggedIn();
    await productsPage.expectLoaded();

    await loginPage.logout();
    await loginPage.expectLoggedOut();
  });

  test('locked user sees login error @regression', async ({ loginPage, testData }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.locked.username, testData.users.locked.password);

    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
