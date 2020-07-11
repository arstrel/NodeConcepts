const AWS = require("aws-sdk");
const keys = require("../config/keys");
const { v1 } = require("uuid");
const requireLogin = require("../middlewares/requireLogin");
const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey,
});

module.exports = (app) => {
  app.post("/api/upload", requireLogin, async (req, res) => {
    const allowedFileTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (allowedFileTypes.includes(req.body.type)) {
      const key = `${req.user.id}/${v1()}.jpeg`;
      const params = {
        Bucket: "blogster-app",
        Key: key,
        ContentType: req.body.type,
        Expires: 60,
      };
      s3.getSignedUrl("putObject", params, (err, url) => {
        res.send({ key, url });
      });
    } else {
      res.status(403).send({ error: "Forbidden file type" });
    }
  });
};
