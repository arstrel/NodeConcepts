const Page = require("./helpers/page");
const { removeTestUsers } = require("./helpers/utils");
const constants = require("./constants");

const url = process.env.TEST_DOMAIN_URL || constants.TEST_LOCALHOST;

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto(url);
});

afterEach(async () => {
  await page.close();
});

describe("and using INvalid inputs", async () => {
  beforeEach(async () => {
    try {
      await page.login();
      await page.click('a[href="/blogs/new"]');
      await page.click("form button");
    } catch (err) {
      console.log("Invalid, describe error: ", err);
    }
  });

  test("the form shows an error message", async () => {
    try {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");
      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    } catch (err) {
      console.log("Invalid form, errors error: ", err);
    }
  });
});
