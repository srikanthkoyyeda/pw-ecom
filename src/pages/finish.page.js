export class Finish {
  constructor(page) {
    this.page = page;
    this.thankYouTextLocator = page.locator(".complete-header");
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
  }

  async backHome() {
    await this.backHomeButton.click();
  }

  async thankYouText() {
    return this.thankYouTextLocator;
  }
}
