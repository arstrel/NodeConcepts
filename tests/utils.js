const sessionFactory = require("./factories/sessionFactory");
const userFactory = require("./factories/userFactory");
const constants = require("./constants");
const mongoose = require("mongoose");
const User = mongoose.model("User");

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

module.exports = {
  withLogin: async (page) => {
    const loginHandler = {
      get: function (target, prop, receiver) {
        if (prop === "login") {
          return login;
        }
        return Reflect.get(...arguments);
      },
    };
    return new Proxy(page, loginHandler);
  },
  removeTestUsers: async () => {
    await User.deleteMany(
      { displayName: constants.TEST_USER_NAME },
      (err, result) => {
        if (err) {
          console.log(err);
        }
      }
    );
  },
};
