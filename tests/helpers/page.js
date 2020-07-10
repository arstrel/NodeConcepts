const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");
const constants = require("../constants");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const customPage = new CustomPage(page);
    return new Proxy(page, {
      get: function (target, property) {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    const url = process.env.TEST_DOMAIN_URL || constants.TEST_LOCALHOST;
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
    await this.page.goto(`${url}/blogs`, {
      waitUntil: ["networkidle0", "domcontentloaded"],
    });
  }

  getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => this[method](path, data))
    );
  }
}

module.exports = CustomPage;
