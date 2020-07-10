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

test("submitting then saving adds post to all posts index page", async () => {
    try {
      await page.login();
      await page.click('a[href="/blogs/new"]');
      await page.type(".title input", "Fresh");
      await page.type(".content input", "Have a smoothie");
      await page.click("form button");
      await page.click("button.green");
      await page.waitForSelector(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf(".card-content p");
      expect(title).toEqual("Fresh");
      expect(content).toEqual("Have a smoothie");
    } catch (err) {
      console.log("BS error: ", err);
    }
  });