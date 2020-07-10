const Page = require("./helpers/page");
const { removeTestUsers } = require("./helpers/utils");
const constants = require('./constants');

const url = process.env.TEST_DOMAIN_URL || constants.TEST_LOCALHOST;

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto(url);
});

afterEach(async () => {
  await page.close(); 
});

test("The header has a correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("Login button leads to Google OAuth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts.google.com/);
});

test("When signed in shows logout button", async () => {
  await page.login();
  const text = await page.getContentsOf('a[href="/auth/logout"]');
  expect(text).toEqual("Logout");
});

