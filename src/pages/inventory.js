export class Inventory {
  constructor(page) {
    this.page = page;
  }

  async addMultiItemsTotheCart(itemName) {
    for (let i = 0; i < itemName.length; i++) {
      const itemLocator = this.page
        .locator(".inventory_item")
        .filter({ hasText: itemName[i] });

      await itemLocator.getByRole("button", { name: "Add to cart" }).click();
    }
  }

  async addItemTotheCart(itemName) {
    const itemLocator = this.page
      .locator(".inventory_item")
      .filter({ hasText: itemName });
    await itemLocator.getByRole("button", { name: "Add to cart" }).click();
  }

  async goto() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }
}
