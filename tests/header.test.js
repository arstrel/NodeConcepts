const puppeteer = require("puppeteer");
const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");

const url = process.env.TEST_DOMAIN_URL || "http://localhost:3000";

let browser, page;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.goto(url);
});

afterEach(async () => {
  await page.close();
});

afterAll(async () => {
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
  async function login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    const cookies = [
      {
        name: "session",
        value: session,
      },
      {
        name: "session.sig",
        value: sig,
      },
    ];
    await this.setCookie(...cookies);
    await this.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }

  const loginHandler = {
    get: function (target, prop, receiver) {
      if (prop === "login") {
        return login;
      }
      return Reflect.get(...arguments);
    },
  };
  const superPage = new Proxy(page, loginHandler);

  await superPage.login();
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);
  expect(text).toEqual("Logout");
});
