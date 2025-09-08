export class CheckoutOverview {
  constructor(page) {
    this.page = page;
    this.itemPriceLocator = page.locator(".inventory_item_price");
    this.taxPriceLocator = page.locator(".summary_tax_label");
    this.totalPriceLocator = page.locator(".summary_total_label");
    this.summarySubTotal = page.locator(".summary_subtotal_label");
    this.finish = page.getByRole("button", { name: "Finish" });
  }
  money(s) {
    return parseFloat(String(s).replace(/[^0-9.]/g, ""));
  }

  async addItemPrice() {
    let sum = 0;
    const count = await this.itemPriceLocator.count();

    for (let i = 0; i < count; i++) {
      const dPrice = await this.itemPriceLocator.nth(i).textContent();
      sum = sum + this.money(dPrice);
    }
    return sum;
  }

  async subTotalOfItems() {
    const subTotalText = await this.summarySubTotal.textContent();
    // const subTotal = await subTotalText.split("$");
    return this.money(subTotalText);
  }

  async totalPrice() {
    const totalText = await this.totalPriceLocator.textContent();
    return this.money(totalText);
  }
  async taxPrice() {
    const taxText = await this.taxPriceLocator.textContent();
    return this.money(taxText);
  }
  async nextPagebutton() {
    await this.finish.click();
  }
}
