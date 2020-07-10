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

afterAll(async (done) => {
  done();
});

test("submitting then saving adds post to all posts index page", async () => {
    try {
      await page.login();
      await page.click('a[href="/blogs/new"]');
      await page.type(".title input", constants.TEST_POST_TITLE);
      await page.type(".content input", constants.TEST_POST_CONTENT);
      await page.click("form button");
      await page.click("button.green");
      await page.waitForSelector(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf(".card-content p");
      expect(title).toEqual(constants.TEST_POST_TITLE);
      expect(content).toEqual(constants.TEST_POST_CONTENT);
    } catch (err) {
      console.log("Create full post error: ", err);
    }
  });