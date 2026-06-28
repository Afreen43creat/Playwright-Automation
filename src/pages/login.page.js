const { expect } = require('@playwright/test');
const { BasePage } = require('./base.page');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"], [data-testid="username"]');
    this.passwordInput = page.locator('[data-test="password"], [data-testid="password"]');
    this.loginButton = page.locator('[data-test="login-button"], [data-testid="login-button"]');
    this.errorMessage = page.locator('[data-test="error"], [data-testid="login-error"]');
    this.menuButton = page.locator('#react-burger-menu-btn, [data-testid="account-menu"]');
    this.logoutLink = page.locator('#logout_sidebar_link, [data-testid="logout"]');
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username, 'username');
    await this.fill(this.passwordInput, password, 'password');
    await this.click(this.loginButton, 'login button');
  }

  async logout() {
    await this.click(this.menuButton, 'menu button');
    await this.click(this.logoutLink, 'logout link');
  }

  async expectLoggedIn() {
    await expect(this.page).toHaveURL(/inventory|products|dashboard/);
  }

  async expectLoggedOut() {
    await expect(this.loginButton).toBeVisible();
  }

  async expectLoginError(message) {
    await expect(this.errorMessage).toContainText(message);
  }
}

module.exports = { LoginPage };
