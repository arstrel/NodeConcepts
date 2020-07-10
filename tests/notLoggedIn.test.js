const Page = require("./helpers/page");
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

describe("When NOT logged in", () => {
  test("cannot create a post", async () => {
    const response = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Not logged in title",
          content: "Not logged in content",
        }),
      }).then((res) => res.json());
    });
    expect(response.error).toBeTruthy();
    expect(response.error).toEqual("You must log in!");
  });

  test("cannot get a list of posts", async () => {
    const response = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    });
    expect(response.error).toBeTruthy();
    expect(response.error).toEqual("You must log in!");
  });
});
