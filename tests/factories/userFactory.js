const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const keys = require("../../config/keys");

const User = mongoose.model("User");

module.exports = () => {
  const id = uuidv4();
  return new User({
    googleId: id,
    displayName: `Test User`,
  }).save();
};
