export class LoginPage {
  constructor(page) {
    this.page = page;
    this.userNameInput = page.locator("#user-name");
    this.passwordInput = page.locator("#password");
    this.submit = page.locator("#login-button");
  }

  async goto() {
    await this.page.goto("/");
    // await this.page.waitForLoadState("networkidle");
  }

  async login(username, password) {
    await this.userNameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submit.click();
  }
}
