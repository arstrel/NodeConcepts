const mongoose = require("mongoose");
const constants = require('../constants');

const User = mongoose.model("User");

module.exports = () => {
  return new User({
    googleId: constants.TEST_USER_ID,
    displayName: constants.TEST_USER_NAME,
  }).save();
};
