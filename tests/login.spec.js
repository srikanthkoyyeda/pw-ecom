import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage.js";
import { Inventory } from "../src/pages/inventory.js";
import { CheckoutOverview } from "../src/pages/checkout.overview.js";
import { CheckoutStep1 } from "../src/pages/checkout.step1.js";
import { Cart } from "../src/pages/cartPage.js";
import { Finish } from "../src/pages/finish.page.js";

test("Login test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();

  await loginPage.login("standard_user", "secret_sauce");
});

test("Invalid Login test", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "testewew");
  await expect(page.locator("[data-test = 'error']")).toContainText(
    "Epic sadface: Username and password do not match any user in this service"
  );
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  await expect(page.locator("#login-button")).toBeVisible();
});

test.describe("@add to cart", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.login("standard_user", "secret_sauce");
  });
  test("Add to cart (single item)", async ({ page }) => {
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    const products = page.locator(".inventory_item_description");
    const pcount = await products.count();

    for (let i = 0; i < pcount; i++) {
      const productName = await products
        .nth(i)
        .locator(".inventory_item_name")
        .textContent();

      if (productName === "Sauce Labs Backpack") {
        await products.nth(i).locator(".pricebar .btn").click();
        break;
      }
    }

    await expect(page.locator(".shopping_cart_badge")).toHaveText("1");

    await page.locator(".shopping_cart_link").click();

    const cartItem = page
      .locator(".inventory_item_name")
      .filter({ hasText: "Sauce Labs Backpack" });
    await expect(cartItem).toContainText("Sauce Labs Backpack");
    await expect(page.getByRole("button", { name: "Remove" })).toBeVisible();
  });

  test("Remove from the cart", async ({ page }) => {
    // const backpackLocator = page
    //   .locator(".inventory_item")
    //   .filter({ hasText: "Sauce Labs Backpack" });

    // await backpackLocator.getByRole("button", { name: "Add to cart" }).click();
    const inventoryPage = new Inventory(page);
    const cartPage = new Cart(page);

    const itemName = "Sauce Labs Backpack";

    await inventoryPage.addItemTotheCart(itemName);

    await expect(page.locator(".shopping_cart_badge")).toHaveCount(1);
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    await page.locator(".shopping_cart_link").click();
    await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
    // const cartItem = page
    //   .locator(".cart_item")
    //   .filter({ hasText: "Sauce Labs Backpack" });

    // await cartItem.getByRole("button", { name: "Remove" }).click();

    await cartPage.removeItemfromCart(itemName);

    await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);

    await expect(page.locator(".shopping_cart_badge")).not.toBeVisible();
    // await expect(cartItem).not.toBeVisible();
  });

  test.only("Add multi items and verify price", async ({ page }) => {
    const inventoryPage = new Inventory(page);
    const cartPage = new Cart(page);
    const checkoutStep1 = new CheckoutStep1(page);
    const checkoutOverview = new CheckoutOverview(page);
    const finish = new Finish(page);

    const itemName = [
      "Test.allTheThings() T-Shirt (Red)",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Onesie",
    ];

    // const itemName1 = "Sauce Labs Bolt T-Shirt";

    // for (let i = 0; i < (await itemName.count()); i++) {
    //   await inventoryPage.addItemTotheCart(itemName.nth(i));
    // }
    // console.log(await itemName.count());

    await inventoryPage.addMultiItemsTotheCart(itemName);

    await cartPage.goto();
    await expect(page.locator(".shopping_cart_badge")).toHaveText(
      String(itemName.length)
    );

    //Assert the cart item with name
    for (let i = 0; i < itemName.length; i++) {
      const cartItem = page.locator(".cart_item");

      await expect(cartItem.nth(i)).toContainText(itemName[i]);
      await expect(cartItem.locator(".cart_quantity").nth(i)).toHaveText("1");
    }

    await page.getByRole("button", { name: "Checkout" }).click();

    await checkoutStep1.yourInfo("John", "Doe", "65434");

    const addItemTotal = await checkoutOverview.addItemPrice();
    const totalPrice = await checkoutOverview.totalPrice();
    const taxPrice = await checkoutOverview.taxPrice();
    const subTotal = await checkoutOverview.subTotalOfItems();
    expect(addItemTotal).toBe(subTotal);
    expect(totalPrice).toBeCloseTo(subTotal + taxPrice, 2);

    await checkoutOverview.nextPagebutton();
    await expect(page).toHaveURL(
      "https://www.saucedemo.com/checkout-complete.html"
    );
    await expect(page.locator(".complete-header")).toHaveText(
      "Thank you for your order!"
    );
    await expect(page.getByRole("button", { name: "Back Home" })).toBeVisible();
    await finish.backHome();

    await expect(page.locator(".shopping_cart_badge")).toHaveCount(0);

    //await page.pause();
  });
});
