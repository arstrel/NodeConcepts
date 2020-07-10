const constants = require("../constants");
const mongoose = require("mongoose");
const User = mongoose.model("User");

function removeTestUsers() {
  return User.deleteMany(
    { displayName: constants.TEST_USER_NAME },
    (err, result) => {
      if (err) {
        console.log(err);
      }
    }
  );
}

module.exports = { removeTestUsers };
