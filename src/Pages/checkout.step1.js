export class CheckoutStep1 {
  constructor(page) {
    this.page = page;

    this.fname = page.getByPlaceholder("First Name");
    this.lname = page.getByPlaceholder("Last Name");
    this.zipcode = page.getByPlaceholder("Zip/Postal Code");
    this.continue = page.getByRole("button", { name: "Continue" });
  }

  async yourInfo(fname, lname, zip) {
    await this.fname.fill(fname);
    await this.lname.fill(lname);
    await this.zipcode.fill(zip);
    await this.continue.click();
  }
}
