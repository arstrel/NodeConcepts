const Page = require("./helpers/page");
const constants = require("./constants");
const { response } = require("express");

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
  const actions = [
    {
      method: "get",
      path: "/api/blogs",
    },
    {
      method: "post",
      path: "/api/blogs",
      body: {
        title: "Reasonable title",
        content: "Some content",
      },
    },
  ];

  test("Blog related actions are prohibited", async () => {
    const responses = await page.execRequests(actions);
    const result = responses.every((r) => r.error === "You must log in!");
    expect(result).toBeTruthy();
  });
});
