const constants = require("../constants");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Blog = mongoose.model("Blog");

async function removeTestRecords() {
  // remove test records older then 15 min
  try {
    const users = await User.deleteMany({
      displayName: constants.TEST_USER_NAME,
      googleId: constants.TEST_USER_ID,
      createdAt: { $lte: new Date(Date.now() - 900000) },
    });
   const blogs = await Blog.deleteMany({
      title: constants.TEST_POST_TITLE,
      content: constants.TEST_POST_CONTENT,
      createdAt: { $lte: new Date(Date.now() - 900000) },
    });
    console.log(`
    Removed ${users.deletedCount} Test Users Records 
    Removed ${blogs.deletedCount} Test Blogs Records 
    `);
  } catch (err) {
    console.error("Error while removing test data from the DB", err);
  }
}

module.exports = { removeTestRecords };
