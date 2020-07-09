const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const constants = require('../constants');

const User = mongoose.model("User");

module.exports = () => {
  const id = uuidv4();
  return new User({
    googleId: id,
    displayName: constants.TEST_USER_NAME,
  }).save();
};
