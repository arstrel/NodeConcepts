const Page = require("./helpers/page");
const { removeTestRecords } = require("./helpers/utils");
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
    await removeTestRecords();
    done();
});

describe("When loggen in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a[href="/blogs/new"]');
  });

  test("After clicking create new post we are at /blogs/new route", async () => {
    const url = await page.url();
    expect(url).toMatch(/blogs\/new/);
  });

  test("can see the post creation form", async () => {
    const titleLabel = await page.getContentsOf("form .title label");
    const contentLabel = await page.getContentsOf("form .content label");
    expect(titleLabel).toEqual("Blog Title");
    expect(contentLabel).toEqual("Content");
  });

  test("submitting takes user to review screen", async () => {
    await page.type(".title input", "Fresh");
    await page.type(".content input", "Have a smoothie");
    await page.click("form button");
    const text = await page.getContentsOf("h5");
    expect(text).toEqual("Please confirm your entries");
  });
});

