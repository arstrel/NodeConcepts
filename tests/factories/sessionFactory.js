const Keygrip = require("keygrip");
const Buffer = require("safe-buffer").Buffer;
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = user => {
  const mockUser = `{"passport":{"user":"${user._id.toString()}"}}`;
  const session = Buffer.from(mockUser, "utf8").toString("base64");
  const sig = keygrip.sign(`session=${session}`);

  return { session, sig };
};
