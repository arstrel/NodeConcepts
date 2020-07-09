const puppeteer = require("puppeteer");
const { withLogin, removeTestUsers } = require("./utils");

const url = process.env.TEST_DOMAIN_URL || "http://localhost:3000";

let browser, page;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

beforeEach(async () => {
  const standardPage = await browser.newPage();
  page = await withLogin(standardPage);
  await page.goto(url);
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
  await removeTestUsers();
  browser.close();
});

test("The header has a correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Login button leads to Google OAuth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts.google.com/);
});

test("When signed in shows logout button", async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
