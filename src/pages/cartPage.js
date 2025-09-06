export class Cart {
  constructor(page) {
    this.page = page;
  }

  async removeItemfromCart(itemName) {
    const cartItem = this.page
      .locator(".inventory_item_name")
      .filter({ hasText: itemName });
    await cartItem.getByRole("button", { name: "Remove" }).click();
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/cart.html");
  }
}
