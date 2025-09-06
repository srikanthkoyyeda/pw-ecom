export class CheckoutOverview {
  constructor(page) {
    this.page = page;
    this.itemPriceLocator = page.locator(".inventory_item_price");
    this.taxPriceLocator = page.locator(".summary_tax_label");
    this.totalPriceLocator = page.locator(".summary_total_label");
  }

  async addItemPrice() {
    let sum = 0;

    const taxText = (await this.taxPriceLocator.innerText()).split("$");
    const tax = parseFloat(taxText[1]);

    for (let i = 0; i < (await this.itemPriceLocator.count()); i++) {
      const dPrice = await this.itemPriceLocator.nth(i).innerText();
      const price = await dPrice.replace(/\$/g, "");

      sum = sum + parseFloat(price);
    }
    return sum + tax;
  }

  async totalPrice() {
    const totalText = await this.totalPriceLocator.innerText();
    const total = await totalText.split("$");

    return parseFloat(total[1]);
  }
}
